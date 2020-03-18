export interface StorageGatewayInterface {
  getOrCreateContainer(name: string): Promise<Object>;

  upload(containerName: string, file: Object): Promise<Object>;
}
