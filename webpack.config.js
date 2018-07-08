let path = require('path');

let conf = {
    entry: './src/components/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'image/',
                        publicPath: 'dist/image/'
                    }
                  }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'dist/fonts/'
                    }
                  }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.mp3/, 
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'audio/',
                    publicPath: 'dist/audio/'
                }
              },
        ]
    }
};

module.exports = (env, options) => {
    let production = options.mode === 'production';

    conf.devtool = production
                    ? 'source-map'
                    : 'eval-sourcemap';
    
    return conf;
};