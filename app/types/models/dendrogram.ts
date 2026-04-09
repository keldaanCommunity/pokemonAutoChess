export interface IDendrogramNode {
  cluster1: number
  cluster2: number
  distance: number
  count: number
}

export interface IClusterProfile {
  cluster_id: number
  size: number
  synergies: Record<string, number>
  top_pokemons: Array<{
    name: string
    frequency: number
  }>
}

export interface IBranchProfile {
  branch_index: number
  merge_index: number
  merge_height: number
  total_size: number
  leaf_cluster_ids: number[]
  synergy: string
  top_pokemons: Array<{
    name: string
    count: number
  }>
}

export interface IDendrogram {
  linkage_method: string
  n_clusters: number
  n_samples: number
  linkage_matrix: IDendrogramNode[]
  cluster_profiles: IClusterProfile[]
  branch_profiles: IBranchProfile[]
  leaves: number[]
  leaf_to_cluster: number[]
  icoord: number[][]
  dcoord: number[][]
  generated_at: string
}
