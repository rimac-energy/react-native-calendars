const { readFileSync, existsSync } = require('node:fs')

module.exports = ({ core, context }) => {
    const path = '.changeset/pre.json'
    const exists = existsSync(path)

    if (!exists) {
        core.info('No pre.json found - skipping pre-release check')
        return
    }

    const { mode, baseBranch } = JSON.parse(readFileSync(path, 'utf8'))

    if (mode === 'enter' && context.ref === `refs/heads/${baseBranch}`) {
        core.setFailed(`Pre-release mode should not be active on "${baseBranch}".`)
        process.exit()
    }
}
