var permissions = {
    user: {
        profile: {
            full: true,
            edit: true,
            permissions: {
                view: true,
                edit: true
            }
        },
        test1: {
            testmax: 10,
            testNested: {
                testNested1: true,
                testNested2: 0
            }
        }
    },
    otherTest: {
        firstLevel: true,
        firstLevelNumber: 20,
        test2: {
            testmax: 10,
            testNested: {
                testNested1: true,
                testNested2: 0
            }
        }
    }
};
module.exports = permissions;
