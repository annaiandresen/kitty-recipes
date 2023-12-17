// TypeScript interface for the localStorage item
interface LocalStorageItem {
    key: string;
    value: any;
  }
  
  // Getter function with error handling
export const getFromLocalStorage = <T>(key: string): T | null => {
    try {
      const storedItem = localStorage.getItem(key);
      if (storedItem) {
        const parsedItem: T = JSON.parse(storedItem);
        return parsedItem;
      }
      return null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  };
  
  // Setter function with error handling
 export  const setToLocalStorage = <T>(item: LocalStorageItem): void => {
    try {
      const serializedItem = JSON.stringify(item.value);
      localStorage.setItem(item.key, serializedItem);
    } catch (error) {
      console.error(`Error setting item to localStorage: ${item.key}`, error);
    }
  };
  
  // Delete function with error handling
 export const deleteFromLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting item from localStorage: ${key}`, error);
    }
  };
  
  