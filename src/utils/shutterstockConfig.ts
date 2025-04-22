
export const getShutterstockCredentials = () => {
  const saved = localStorage.getItem('shutterstock_credentials');
  if (!saved) {
    throw new Error('Shutterstock credentials not found');
  }
  return JSON.parse(saved);
};

