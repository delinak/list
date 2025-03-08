const listModel = require('../models/list.model');
const ListService = require('../services/listService');

class ScheduledTasks {
    static async resetListsBySchedule() {
        try {
            const currentDate = new Date();
            
            // Find lists that need resetting
            const lists = await listModel.find({
                resetCycle: { $ne: 'none' }
            });

            for (const list of lists) {
                const lastReset = new Date(list.lastReset);
                let shouldReset = false;

                switch (list.resetCycle) {
                    case 'daily':
                        shouldReset = currentDate.getDate() !== lastReset.getDate();
                        break;
                    case 'weekly':
                        const weekDiff = Math.floor((currentDate - lastReset) / (1000 * 60 * 60 * 24 * 7));
                        shouldReset = weekDiff >= 1;
                        break;
                    case 'monthly':
                        shouldReset = currentDate.getMonth() !== lastReset.getMonth();
                        break;
                }

                if (shouldReset) {
                    await ListService.resetListEntries(list._id);
                }
            }
        } catch (error) {
            console.error('Error in scheduled reset:', error);
        }
    }
}

// Run the reset check every hour
setInterval(ScheduledTasks.resetListsBySchedule, 1000 * 60 * 60);

module.exports = ScheduledTasks; 