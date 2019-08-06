// logging with constant on/off
const dm_do_log = true;

function dm_log(text) {
    if (dm_do_log) {
        console.log(text);
    }
}

module.exports.dm_log = dm_log;
