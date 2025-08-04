/**
 * Migration utility for optimizing UserMetadata pokemonCollection emotion storage
 *
 * This script helps migrate from the old emotion storage format to the new optimized format
 * that uses bitwise operations to store emotions in just 5 bytes instead of multiple arrays.
 */

import { connect } from "mongoose"
import { CollectionUtils } from "../app/core/collection"
import UserMetadata from "../app/models/mongo-models/user-metadata"
import { Emotion } from "../app/types"

export class Collection {
    /**
     * Migrate a single user's pokemon collection to the optimized format
     */
    static migrateUserCollection(userDoc: any): boolean {
        let hasChanges = false

        if (!userDoc.pokemonCollection) return false

        for (const [index, pokemonDoc] of userDoc.pokemonCollection.entries()) {
            // Skip if already migrated (has unlocked)
            if (pokemonDoc.unlocked && pokemonDoc.unlocked.length === 3) {
                continue
            }

            // Access emotions safely - use get() method to bypass getters if needed
            const emotions = pokemonDoc.get('emotions') || []
            const shinyEmotions = pokemonDoc.get('shinyEmotions') || []

            const mask = CollectionUtils.getEmotionMask(
                emotions,
                shinyEmotions
            )

            // Update the pokemon document
            pokemonDoc.unlocked = Buffer.copyBytesFrom(mask, 0, 5)

            hasChanges = true
        }

        return hasChanges
    }

    /**
     * Migrate all users in the database (run this carefully in production!)
     */
    static async migrateAllUsers(
        batchSize: number = 100,
        dryRun: boolean = true
    ): Promise<void> {
        console.log(`Starting emotion migration (dryRun: ${dryRun})`)

        let processed = 0
        let migrated = 0
        let skip = 0

        const totalUsers = await UserMetadata.countDocuments()
        console.log(`Total users to process: ${totalUsers}`)

        while (skip < totalUsers) {
            const users = await UserMetadata.find({}).skip(skip).limit(batchSize).exec()

            for (const user of users) {
                processed++

                const hasChanges = this.migrateUserCollection(user)

                if (hasChanges) {
                    migrated++

                    if (!dryRun) {
                        await user.save()
                        console.log(`✅ Migrated user ${user.uid} (${user.displayName})`)
                    } else {
                        console.log(
                            `🔍 Would migrate user ${user.uid} (${user.displayName})`
                        )
                    }
                }

                if (processed % 100 === 0) {
                    console.log(
                        `Progress: ${processed}/${totalUsers} users processed, ${migrated} migrated`
                    )
                }
            }

            skip += batchSize
        }

        console.log(
            `Migration complete: ${processed} users processed, ${migrated} users migrated`
        )
    }

    /**
     * Cleanup legacy fields after migration is complete and verified
     */
    static async cleanupLegacyFields(
        dryRun: boolean = true
    ): Promise<void> {
        console.log(`Starting legacy field cleanup (dryRun: ${dryRun})`)

        // Since pokemonCollection is a Map (object), we need to process each user individually
        let processed = 0
        let updated = 0
        const batchSize = 100
        const totalUsers = await UserMetadata.countDocuments()

        for (let skip = 0; skip < totalUsers; skip += batchSize) {
            const users = await UserMetadata.find({}).skip(skip).limit(batchSize).exec()

            for (const user of users) {
                processed++
                let hasLegacyFields = false

                const unsetOperations = {}

                // Check if any pokemon in the collection has legacy fields
                for (const [pokemonId, pokemon] of user.pokemonCollection) {
                    const pokemonDoc = pokemon as any // Cast to any to access legacy fields
                    if (pokemonDoc.get("emotions") || pokemonDoc.get("shinyEmotions")) {
                        hasLegacyFields = true

                        // Remove legacy fields from this pokemon
                        unsetOperations[`pokemonCollection.${pokemonId}.emotions`] = ""
                        unsetOperations[`pokemonCollection.${pokemonId}.shinyEmotions`] = ""
                    }
                }

                if (hasLegacyFields) {
                    if (!dryRun) {
                        await UserMetadata.updateOne(
                            { _id: user._id },
                            { $unset: unsetOperations }
                        )
                    } else {
                        console.log(
                            `🔍 Would clean legacy fields from user ${user.uid} (${user.displayName})`
                        )
                    }
                    updated++
                    console.log(`✅ Cleaned legacy fields from user ${user.uid}`)
                }

                if (processed % 100 === 0) {
                    console.log(`Progress: ${processed}/${totalUsers} users processed, ${updated} updated`)
                }
            }
        }

        console.log(`Cleaned up legacy fields from ${updated} users`)
    }
}


    /**
     * Verify migration integrity by comparing old and new formats
     */
    static verifyMigration(userDoc: any): { success: boolean; errors: string[] } {
    const errors: string[] = []

    if (!userDoc.pokemonCollection) {
        return { success: true, errors: [] }
    }

    for (const [index, pokemon] of userDoc.pokemonCollection.entries()) {
        if (!pokemon.unlocked) {
            errors.push(`Pokemon ${index}: Missing unlocked`)
            continue
        }

        // Compare legacy data with optimized data
        const legacy = {
            emotions: pokemon.emotions || [],
            shinyEmotions: pokemon.shinyEmotions || []
        }

        const { emotions, shinyEmotions } = CollectionUtils.getEmotionsUnlocked(pokemon.unlocked)

        // Check emotions arrays
        const legacyEmotions = legacy.emotions as Emotion[]
        const optimizedEmotions = emotions
        const legacyEmotionsSet = new Set(legacyEmotions)
        const optimizedEmotionsSet = new Set(optimizedEmotions)

        if (
            legacyEmotionsSet.size !== optimizedEmotionsSet.size ||
            !legacyEmotions.every((e) => optimizedEmotionsSet.has(e))
        ) {
            errors.push(`Pokemon ${index}: Emotions mismatch`)
        }

        // Check shiny emotions arrays
        const legacyShinyEmotions = legacy.shinyEmotions as Emotion[]
        const optimizedShinyEmotions = shinyEmotions
        const legacyShinySet = new Set(legacyShinyEmotions)
        const optimizedShinySet = new Set(optimizedShinyEmotions)

        if (
            legacyShinySet.size !== optimizedShinySet.size ||
            !legacyShinyEmotions.every((e) => optimizedShinySet.has(e))
        ) {
            errors.push(`Pokemon ${index}: Shiny emotions mismatch`)
        }
    }

    return { success: errors.length === 0, errors }
}

    /**
     * Calculate space savings for a user's collection
     */
    static calculateUserSpaceSavings(userDoc: any): {
    pokemonCount: number
    oldSize: number
    newSize: number
    savings: number
    savingsPercent: number
} {
    let pokemonCount = 0
    let totalOldSize = 0
    let totalNewSize = 0

    function calculateSpaceSavings(avgEmotionsPerPokemon: number = 5): {
        oldSize: number
        newSize: number
        savings: number
        savingsPercent: number
    } {
        const oldNormalSize = avgEmotionsPerPokemon * 8 + 24
        const oldShinySize = avgEmotionsPerPokemon * 8 + 24
        const oldSelectedSize = 8 + 1
        const oldSize = oldNormalSize + oldShinySize + oldSelectedSize

        const newSize = 5

        const savings = oldSize - newSize
        const savingsPercent = (savings / oldSize) * 100

        return { oldSize, newSize, savings, savingsPercent }
    }

    if (!userDoc.pokemonCollection) {
        return {
            pokemonCount: 0,
            oldSize: 0,
            newSize: 0,
            savings: 0,
            savingsPercent: 0
        }
    }

    for (const [_, pokemon] of userDoc.pokemonCollection.entries()) {
        pokemonCount++

        const emotionCount = (pokemon.emotions || []).length
        const shinyEmotionCount = (pokemon.shinyEmotions || []).length
        const avgEmotions = (emotionCount + shinyEmotionCount) / 2

        const savings = calculateSpaceSavings(avgEmotions)
        totalOldSize += savings.oldSize
        totalNewSize += savings.newSize
    }

    const totalSavings = totalOldSize - totalNewSize
    const savingsPercent =
        totalOldSize > 0 ? (totalSavings / totalOldSize) * 100 : 0

    return {
        pokemonCount,
        oldSize: totalOldSize,
        newSize: totalNewSize,
        savings: totalSavings,
        savingsPercent
    }
}

    /**
     * Generate migration report
     */
    static async generateMigrationReport(): Promise < void> {
    console.log("Generating migration report...")

        const sampleSize = 100
        const users = await UserMetadata.find().limit(sampleSize).exec()

        let totalUsers = 0
        let totalPokemon = 0
        let totalOldSize = 0
        let totalNewSize = 0
        let usersNeedingMigration = 0

        for(const user of users) {
        totalUsers++

        const needsMigration = this.userNeedsMigration(user)
        if (needsMigration) {
            usersNeedingMigration++
        }

        const savings = this.calculateUserSpaceSavings(user)
        totalPokemon += savings.pokemonCount
        totalOldSize += savings.oldSize
        totalNewSize += savings.newSize
    }

        const totalSavings = totalOldSize - totalNewSize
        const savingsPercent =
        totalOldSize > 0 ? (totalSavings / totalOldSize) * 100 : 0

        console.log("\n=== EMOTION OPTIMIZATION MIGRATION REPORT ===")
        console.log(`Sample size: ${totalUsers} users`)
        console.log(`Total Pokemon entries: ${totalPokemon}`)
        console.log(
            `Users needing migration: ${usersNeedingMigration} (${((usersNeedingMigration / totalUsers) * 100).toFixed(1)}%)`
        )
        console.log(`\nSpace Analysis:`)
        console.log(`- Current size: ${totalOldSize} bytes`)
        console.log(`- Optimized size: ${totalNewSize} bytes`)
        console.log(
            `- Savings: ${totalSavings} bytes (${savingsPercent.toFixed(1)}%)`
        )
        console.log(
            `- Average savings per user: ${(totalSavings / totalUsers).toFixed(1)} bytes`
        )
        console.log(
            `\nFor full database, estimated savings: ${((totalSavings / sampleSize) * (await UserMetadata.countDocuments())).toFixed(0)} bytes`
        )
        console.log("============================================\n")
}

    private static userNeedsMigration(userDoc: any): boolean {
    if (!userDoc.pokemonCollection) return false

    for (const [_, pokemon] of userDoc.pokemonCollection.entries()) {
        if (!pokemon.unlocked || pokemon.unlocked.length !== 3) {
            return true
        }
    }

    return false
}
}

// CLI interface for running migrations
if (require.main === module) {
    const command = process.argv[2]
    const dryRun = process.argv.includes("--dry-run")

    connect(process.env.MONGO_URI!)

    switch (command) {
        case "report":
            Collection.generateMigrationReport()
            break

        case "migrate":
            Collection.migrateAllUsers(100, dryRun)
            break

        case "cleanup":
            Collection.cleanupLegacyFields(dryRun)
            break

        default:
            console.log("Usage:")
            console.log(
                "  npm run collection-migration report    - Generate migration report"
            )
            console.log(
                "  npm run collection-migration migrate [--dry-run] - Migrate users"
            )
            console.log(
                "  npm run collection-migration cleanup [--dry-run] - Remove legacy fields"
            )
    }
}
