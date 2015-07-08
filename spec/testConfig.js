var path = require('path');

module.exports = {
    // each entry should be keyed by the name of the build tool to match output for. In this case it's all gibberish, of course
    'apollo-thirteen': { 
        // a regex to match error output from the build tool. Include any number of capturing groups "(  )" to capture strings
        // to use in the notification. Note that you can use non-capturing group (?:  ) if you don't want the string.
        // Captured groups are available in the title, subtitle, and message by using the {{group#}} notation, e.g.
        // {{1}} for the first group, {{2}} for the second, etc. TIP: Use triple curly brackets to avoid html escaping.
        regex: /Houston, we've got a(?:n)? (.*)/,
        // The properties below are the same ones which are defined by the node-notifier module
        // the title should idenify the build tool
        title: 'Apollo 13',
        // the subtitle is usually file_name[line:column]. In this case we just output a string
        subtitle: '.. aiming for the moon!',
        // the message should be the error message
        message: 'Now they got {{{1}}}! LOL!',
        // supply an icon this way
        icon: path.join(process.cwd(), '/buildenv/images/apollo13.png'),
        // and a sound in this way (OS specific strings, see https://www.npmjs.com/package/node-notifier)
        sound: 'Ping'
        // Also, you can specify 'contentImage', 'open', and 'wait' if you find a use case for that. See the
        // node-notfier docs for details.
    }
}