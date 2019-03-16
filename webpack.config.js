module.exports = {
    entry: './app/App.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            use: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, {
            test: /\.(?:png|jpg|gif|svg)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'assets/[hash].[ext]',
                }
            }, ]
        }]
    }
}