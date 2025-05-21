export const services = {
  paypal: {
    name: 'PayPal',
    configPath: './paypal/config.js',
    icon: './assets/icons/paypal.svg'
  },
  stripe: {
    name: 'Stripe',
    configPath: './stripe/config.js',
    icon: './assets/icons/stripe.svg'
  },
  google: {
    name: 'Google',
    configPath: './google/config.js',
    icon: './assets/icons/google.svg'
  },
  facebook: {
    name: 'Facebook',
    configPath: './facebook/config.js',
    icon: './assets/icons/facebook.svg'
  },
  twitter: {
    name: 'Twitter',
    configPath: './twitter/config.js',
    icon: './assets/icons/twitter.svg'
  }
};

export const loadService = async (serviceName) => {
  const service = services[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  const config = await import(service.configPath);
  return { ...service, config };
};
