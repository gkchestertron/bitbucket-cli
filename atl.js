require('fun_with_flags')({
    branch : require('./commands/branch'),
    build  : require('./commands/build'),
    pr     : require('./commands/pr'),
    task   : require('./commands/task')
});
