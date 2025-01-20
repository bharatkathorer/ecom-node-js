const sampleController = {

    index: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    view: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    store: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    update: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    destroy: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },
}

module.exports = sampleController;
