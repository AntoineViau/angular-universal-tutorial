import rollup from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
    entry: "src/client.aot.js",
    dest: 'aot/build.js', // output a single application bundle
    sourceMap: false,
    format: 'iife',
    plugins: [
        nodeResolve({ jsnext: true, module: true }),
        commonjs({
            include: ['node_modules/rxjs/**', 'node_modules/angular2-universal/**']
        }),
        uglify()
    ]
}
