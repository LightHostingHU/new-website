/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
                port: '',
                pathname: '/**',
            },
            
        ],
    },
    // webpack: (config) => {
    //     config.resolve.alias = {
    //         ...config.resolve.alias,
    //         '@mapbox/node-pre-gyp': false,
    //         'bcrypt': false, // or use an alternative like 'bcryptjs'
    //     };
    //     return config;
    // },

}

module.exports = nextConfig
