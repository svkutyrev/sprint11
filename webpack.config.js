const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const WebpackMd5Hash = require('webpack-md5-hash'); // добавили плагин
const webpack = require('webpack');

module.exports = {
    entry: { 
        main: './src/index.js' 
    },
    // указали первое место куда заглянет webpack — файл index.js
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
        // указали в какой файл будет собирться весь js и дали ему имя
    },
    module: {
        rules: [{ // тут описываются правила
            test: /\.js$/, // регулярное выражение, которое ищет все js файлы
            use: { 
                loader: "babel-loader" 
            }, // весь JS обрабатывается пакетом babel-loader
            exclude: /node_modules/ // исключает папку node_modules
        },
        {
            test: /\.css$/, // применять это правило только к CSS-файлам
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] // к этим файлам нужно применить пакеты, которые мы уже установили
        }
    ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        }),
        //new WebpackMd5Hash(),
        new HtmlWebpackPlugin({
            // Означает, что:
            inject: false, // стили НЕ нужно прописывать внутри тегов
            hash: true, // для страницы нужно считать хеш
            template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
            filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        
    ]
}
// module.exports — это синтаксис экспорта в Node.js