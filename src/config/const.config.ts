interface ConstConfig {
  NODE_ENV_LIST: string[]
};

export const constConfig: ConstConfig = {
  NODE_ENV_LIST: ['development', 'test', 'patch', 'stage', 'production']
}