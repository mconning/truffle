import { mergeSchemas } from "@gnd/graphql-tools";

import { schema as rootSchema } from "truffle-db/schema";

export const schema = mergeSchemas({
  schemas: [
    // HACK github.com/apollographql/graphql-tools/issues/847
    // fix seems to require nesting mergeSchemas so extend works
    mergeSchemas({
      schemas: [
        rootSchema,
        `
        extend type Source {
          id: ID!
        }
        extend type Bytecode {
          id: ID!
        }
        extend type Contract {
          id: ID!
        }
        extend type Compilation {
          id: ID!
        }
        extend type ContractInstance {
          id: ID!
        }
        extend type Network {
          id: ID!
        }
        `
      ]
    }),

    // define entrypoints
    `type Query {
      contractNames: [String]!
      contract(id: ID!): Contract
      compilation(id: ID!): Compilation

      bytecodes: [Bytecode]
      compilations: [Compilation]
      contracts: [Contract]
      contractInstances: [ContractInstance]
      networks: [Network]
      sources: [Source]

      source(id: ID!): Source
      bytecode(id: ID!): Bytecode
      contractInstance(id: ID!): ContractInstance
      network(id: ID!): Network
    }

    input SourceInput {
      contents: String!
      sourcePath: String
    }

    input SourcesAddInput {
      sources: [SourceInput!]!
    }

    type SourcesAddPayload {
      sources: [Source!]
    }

    input BytecodeLinkReferenceInput {
      offsets: [Int!]!
      name: String
      length: Int!
    }

    input BytecodeInput {
      bytes: Bytes!
      linkReferences: [BytecodeLinkReferenceInput]
    }

    input BytecodesAddInput {
      bytecodes: [BytecodeInput!]!
    }

    type BytecodesAddPayload {
      bytecodes: [Bytecode!]
    }

    input ContractSourceInput {
      id: ID!
    }

    input AbiInput {
      json: String!
      items: [String]
    }

    input ContractCompilationInput {
      id: ID!
    }

    input ContractSourceContractInput {
      index: FileIndex
    }

    input ContractConstructorBytecodeInput {
      id: ID!
    }

    input ContractConstructorLinkedBytecodeInput {
      bytecode: ContractConstructorBytecodeInput!
      linkValues: [ContractConstructorLinkValueInput]
    }

    input ContractConstructorInput {
      createBytecode: ContractConstructorLinkedBytecodeInput!
    }

    input ContractInput {
      name: String
      abi: AbiInput
      compilation: ContractCompilationInput
      sourceContract: ContractSourceContractInput
      constructor: ContractConstructorInput
    }

    input ContractsAddInput {
      contracts: [ContractInput!]!
    }

    type ContractsAddPayload {
      contracts: [Contract]!
    }

    input CompilerInput {
      name: String
      version: String
      settings: Object
    }

    input CompilationSourceInput {
      id: ID!
    }

    input CompilationSourceContractSourceInput {
      id: ID!
    }

    input CompilationSourceContractAstInput {
      json: String!
    }

    input CompilationSourceContractInput {
      name: String
      source: CompilationSourceContractSourceInput
      ast: CompilationSourceContractAstInput
    }

    input CompilationSourceMapInput {
      json: String!
    }

    input CompilationInput {
      compiler: CompilerInput!
      contracts: [CompilationSourceContractInput!]
      sources: [CompilationSourceInput!]!
      sourceMaps: [CompilationSourceMapInput]
    }
    input CompilationsAddInput {
      compilations: [CompilationInput!]!
    }
    type CompilationsAddPayload {
      compilations: [Compilation!]
    }

    input LinkReferenceInput {
      bytecode: ID!
      index: FileIndex
    }

    input ContractInstanceLinkValueInput {
      value: Address!
      linkReference: LinkReferenceInput!
    }

    input ContractInstanceCreationConstructorLinkValueInput {
      value: Address!
      linkReference: LinkReferenceInput!
    }

    input ContractConstructorLinkValueInput {
      value: Address!
      linkReference: LinkReferenceInput!
    }

    type ContractInstancesAddPayload {
      contractInstances: [ContractInstance!]!
    }

    input ContractInstanceAddressInput {
      address: Address!
    }

    input ContractInstanceNetworkInput {
      id: ID!
    }

    input ContractInstanceBytecodeInput {
      id: ID!
    }

    input ContractInstanceContractInput {
      id: ID!
    }

    input ContractInstanceCreationConstructorBytecodeIdInput {
      id: ID!
    }

    input ContractInstanceCreationConstructorBytecodeInput {
      bytecode: ContractInstanceCreationConstructorBytecodeIdInput
      linkValues: [ContractInstanceCreationConstructorLinkValueInput]
    }

    input ContractInstanceCreationConstructorInput {
      createBytecode: ContractInstanceCreationConstructorBytecodeInput!
    }

    input ContractInstanceCreationInput {
      transactionHash: TransactionHash!
      constructor: ContractInstanceCreationConstructorInput!
    }

    input ContractInstanceLinkedBytecodeInput {
      bytecode: ContractInstanceBytecodeInput!
      linkValues: [ContractInstanceLinkValueInput]
    }

    input ContractInstanceInput {
      address: Address!
      network: ContractInstanceNetworkInput
      creation: ContractInstanceCreationInput
      contract: ContractInstanceContractInput
      callBytecode: ContractInstanceLinkedBytecodeInput
    }

    input ContractInstancesAddInput {
      contractInstances: [ContractInstanceInput!]!
    }

    type NetworksAddPayload {
      networks: [Network!]!
    }

    input HistoricBlockInput {
      height: Int!
      hash: String!
    }

    input NetworkInput {
      name: String
      networkId: NetworkId!
      historicBlock: HistoricBlockInput!
    }

    input NetworksAddInput {
      networks: [NetworkInput!]!
    }

    type Mutation {
      sourcesAdd(input: SourcesAddInput!): SourcesAddPayload
      bytecodesAdd(input: BytecodesAddInput!): BytecodesAddPayload
      contractsAdd(input: ContractsAddInput!): ContractsAddPayload
      compilationsAdd(input: CompilationsAddInput!): CompilationsAddPayload
      contractInstancesAdd(input: ContractInstancesAddInput!): ContractInstancesAddPayload
      networksAdd(input: NetworksAddInput!): NetworksAddPayload
    } `
  ],

  resolvers: {
    Query: {
      contractNames: {
        resolve: (_, {}, { workspace }) => workspace.contractNames()
      },
      contracts: {
        resolve: (_, {}, { workspace }) => workspace.contracts()
      },
      contract: {
        resolve: (_, { id }, { workspace }) => workspace.contract({ id })
      },
      sources: {
        resolve: (_, {}, { workspace }) => workspace.sources()
      },
      source: {
        resolve: (_, { id }, { workspace }) => workspace.source({ id })
      },
      bytecodes: {
        resolve: (_, {}, { workspace }) => workspace.bytecodes()
      },
      bytecode: {
        resolve: (_, { id }, { workspace }) => workspace.bytecode({ id })
      },
      compilations: {
        resolve: (_, {}, { workspace }) => workspace.compilations()
      },
      compilation: {
        resolve: (_, { id }, { workspace }) => workspace.compilation({ id })
      },
      contractInstances: {
        resolve: (_, {}, { workspace }) => workspace.contractInstances()
      },
      contractInstance: {
        resolve: (_, { id }, { workspace }) =>
          workspace.contractInstance({ id })
      },
      networks: {
        resolve: (_, {}, { workspace }) => workspace.networks()
      },
      network: {
        resolve: (_, { id }, { workspace }) => workspace.network({ id })
      }
    },
    Mutation: {
      sourcesAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.sourcesAdd({ input })
      },
      bytecodesAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.bytecodesAdd({ input })
      },
      contractsAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.contractsAdd({ input })
      },
      compilationsAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.compilationsAdd({ input })
      },
      contractInstancesAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.contractInstancesAdd({ input })
      },
      networksAdd: {
        resolve: (_, { input }, { workspace }) =>
          workspace.networksAdd({ input })
      }
    },
    Compilation: {
      sources: {
        resolve: ({ sources }, _, { workspace }) =>
          Promise.all(sources.map(source => workspace.source(source)))
      }
    },
    Contract: {
      compilation: {
        resolve: ({ compilation }, _, { workspace }) =>
          workspace.compilation(compilation)
      },
      sourceContract: {
        fragment: `... on Contract { compilation { id } }`,
        resolve: async ({ sourceContract, compilation }, _, { workspace }) => {
          const { contracts: sourceContracts } = await workspace.compilation(
            compilation
          );

          return sourceContracts[sourceContract.index];
        }
      },
      constructor: {
        resolve: async ({ constructor }, _, { workspace }) => {
          let bytecode = await workspace.bytecode(
            constructor.createBytecode.bytecode
          );
          let linkValues = constructor.createBytecode.linkValues.map(
            ({ value, linkReference }) => {
              return {
                value: value,
                linkReference: bytecode.linkReferences[linkReference.index]
              };
            }
          );
          return {
            createBytecode: {
              bytecode: bytecode,
              linkValues: linkValues
            }
          };
        }
      }
    },
    ContractInstance: {
      network: {
        resolve: async ({ network }, _, { workspace }) =>
          await workspace.network(network)
      },
      contract: {
        resolve: ({ contract }, _, { workspace }) =>
          workspace.contract(contract)
      },
      callBytecode: {
        resolve: async ({ callBytecode }, _, { workspace }) => {
          let bytecode = await workspace.bytecode(callBytecode.bytecode);
          let linkValues = callBytecode.linkValues.map(
            ({ value, linkReference }) => {
              return {
                value: value,
                linkReference: bytecode.linkReferences[linkReference.index]
              };
            }
          );
          return {
            bytecode: bytecode,
            linkValues: linkValues
          };
        }
      },
      creation: {
        resolve: async (input, _, { workspace }) => {
          let bytecode = await workspace.bytecode(
            input.creation.constructor.createBytecode.bytecode
          );
          let transactionHash = input.creation.transactionHash;
          let linkValues = input.creation.constructor.createBytecode.linkValues.map(
            ({ value, linkReference }) => {
              return {
                value: value,
                linkReference: bytecode.linkReferences[linkReference.index]
              };
            }
          );
          return {
            transactionHash: transactionHash,
            constructor: {
              createBytecode: {
                bytecode: bytecode,
                linkValues: linkValues
              }
            }
          };
        }
      }
    },
    SourceContract: {
      source: {
        resolve: ({ source }, _, { workspace }) => workspace.source(source)
      }
    }
  }
});