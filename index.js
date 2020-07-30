const htmlMinifier = require("html-minifier-terser");
const PluginError = require("plugin-error");
const Transform = require("stream").Transform;

const PLUGIN_NAME = "gulp-html-minimizer";

module.exports = (options = {}) => {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (chunk._contents.length === 0 || chunk.isNull()) {
        return callback(null, chunk);
      }

      if (chunk.isBuffer()) {
        try {
          chunk._contents = Buffer.from(
            htmlMinifier.minify(chunk._contents.toString(encoding), options),
            encoding
          );
          return callback(null, chunk);
        } catch (error) {
          if (options.skipInvalidFiles) {
            process.stderr.write(
              `${chunk.relative} failed parsing and has been skipped.\r\n`
            );
            return callback();
          }
          return callback(
            new PluginError(PLUGIN_NAME, error, { fileName: chunk.relative })
          );
        }
      } else if (chunk.isStream()) {
        return callback(
          new PluginError(PLUGIN_NAME, "Streaming is not supported.")
        );
      }
    },
  });
};
