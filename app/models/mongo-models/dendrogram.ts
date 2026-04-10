import { model, Schema } from "mongoose"
import type { IDendrogram } from "../../types/models/dendrogram"

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
