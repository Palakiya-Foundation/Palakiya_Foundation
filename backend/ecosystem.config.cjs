module.exports = {
  apps: [
    {
      name: 'ngo-backend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ngo/backend',
      env: {
        NODE_ENV: 'production',
        PORT: '5000'
      }
    }
  ]
};
