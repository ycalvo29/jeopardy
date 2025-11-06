import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  generates: {
    'server.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: true
      }
    }
  }
}
export default config