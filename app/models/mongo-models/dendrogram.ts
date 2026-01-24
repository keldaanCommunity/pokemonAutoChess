import { model, Schema } from "mongoose"

/**
 * Represents a single merge/node in the dendrogram hierarchy
 * Each merge combines two clusters into one at a certain distance
 */
export interface IDendrogramNode {
  /** Index of first cluster being merged (can reference earlier merge or leaf) */
  cluster1: number
  /** Index of second cluster being merged */
  cluster2: number
  /** Distance/height at which the merge occurs */
  distance: number
  /** Number of original observations in this new cluster */
  count: number
}

/**
 * Profile for a leaf cluster showing its characteristics
 */
export interface IClusterProfile {
  /** Cluster ID (1-based) */
  cluster_id: number
  /** Number of matches in this cluster */
  size: number
  /** Active synergies with their effective levels */
  synergies: Record<string, number>
  /** Top 10 most popular pokemons in this cluster */
  top_pokemons: Array<{
    name: string
    frequency: number
  }>
}

/**
 * Profile for a branch (internal node) showing merged cluster characteristics
 */
export interface IBranchProfile {
  /** Branch index (corresponds to icoord/dcoord index) */
  branch_index: number
  /** Linkage matrix row index this branch represents */
  merge_index: number
  /** Distance/height at which this merge occurs */
  merge_height: number
  /** Total number of samples under this branch */
  total_size: number
  /** Leaf cluster IDs that belong to this branch */
  leaf_cluster_ids: number[]
  /** Dominant synergy for this branch (highest effective level) */
  synergy: string
  /** Top 5 most used pokemons in this branch with their counts */
  top_pokemons: Array<{
    name: string
    count: number
  }>
}

/**
 * Full dendrogram data structure for rendering in external apps
 */
export interface IDendrogram {
  /** Linkage method used ('ward', 'complete', 'average', 'single') */
  linkage_method: string
  /** Number of leaf clusters */
  n_clusters: number
  /** Total number of data points */
  n_samples: number
  /**
   * Linkage matrix - array of merge operations
   * Each entry: [cluster1_idx, cluster2_idx, distance, count]
   * For n samples, there are n-1 merges
   * Indices 0 to n-1 are original samples, n+ are merged clusters
   */
  linkage_matrix: IDendrogramNode[]
  /** Cluster profiles with synergy characterization (leaves) */
  cluster_profiles: IClusterProfile[]
  /** Branch profiles with synergy characterization (internal nodes) */
  branch_profiles: IBranchProfile[]
  /** Ordered leaf labels from dendrogram layout */
  leaves: number[]
  /** Map from visual leaf position (0 to n_clusters-1) to cluster_id */
  leaf_to_cluster: number[]
  /** X coordinates for plotting (icoord from scipy dendrogram) */
  icoord: number[][]
  /** Y coordinates for plotting (dcoord from scipy dendrogram) */
  dcoord: number[][]
  /** Timestamp when generated */
  generated_at: string
}

const clusterProfileSchema = new Schema({
  cluster_id: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  synergies: {
    type: Map,
    of: Number
  },
  top_pokemons: [
    {
      name: String,
      frequency: Number
    }
  ]
})

const branchProfileSchema = new Schema({
  branch_index: {
    type: Number,
    required: true
  },
  merge_index: {
    type: Number,
    required: true
  },
  merge_height: {
    type: Number,
    required: true
  },
  total_size: {
    type: Number,
    required: true
  },
  leaf_cluster_ids: [Number],
  synergy: {
    type: String
  },
  top_pokemons: [
    {
      name: String,
      count: Number
    }
  ]
})

const dendrogramNodeSchema = new Schema({
  cluster1: {
    type: Number,
    required: true
  },
  cluster2: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

const dendrogramSchema = new Schema({
  linkage_method: {
    type: String,
    required: true
  },
  n_clusters: {
    type: Number,
    required: true
  },
  n_samples: {
    type: Number,
    required: true
  },
  linkage_matrix: [dendrogramNodeSchema],
  cluster_profiles: [clusterProfileSchema],
  branch_profiles: [branchProfileSchema],
  leaves: [Number],
  leaf_to_cluster: [Number],
  icoord: [[Number]],
  dcoord: [[Number]],
  generated_at: {
    type: String,
    required: true
  }
})

export default model<IDendrogram>("Dendrogram", dendrogramSchema, "dendrogram")

export async function fetchDendrogram(): Promise<IDendrogram | null> {
  return fetch("/dendrogram").then((res) => res.json())
}
