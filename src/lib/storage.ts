// Abstração para localStorage com suporte a tipos
export class StorageManager {
  private prefix = '10000horas_';

  // Salvar dados
  set<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.prefix + key, serializedData);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Recuperar dados
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  // Remover item
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  // Limpar todos os dados
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }

  // Verificar se existe
  exists(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  // Obter todas as chaves com o prefixo
  getKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }
}

// Instância singleton
export const storage = new StorageManager();

// Utilitários para backup e restauração
export const exportData = (): string => {
  const data: Record<string, unknown> = {};
  const keys = storage.getKeys();
  
  keys.forEach(key => {
    data[key] = storage.get(key);
  });
  
  return JSON.stringify({
    version: '1.0',
    timestamp: new Date().toISOString(),
    data
  }, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    
    if (!parsed.data || !parsed.version) {
      throw new Error('Formato de dados inválido');
    }
    
    // Limpar dados existentes
    storage.clear();
    
    // Importar novos dados
    Object.entries(parsed.data).forEach(([key, value]) => {
      storage.set(key, value);
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};