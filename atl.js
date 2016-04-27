require('fun_with_flags')({
    build    : require('./commands/build'),
    checkout : require('./commands/checkout'),
    pr       : require('./commands/pr'),
    task     : require('./commands/task')
});
