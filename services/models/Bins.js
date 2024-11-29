module.exports = (pool) => {
    const createBins = async (donorId, binTypeId) => {
        const binTypes = Array.isArray(binTypeId) ? binTypeId : [binTypeId];
        let checkIfBinsExist = await pool.query('select * from waste_bin where waste_donor_id = $1', [donorId]);
        let isAdded = false;
        if (checkIfBinsExist.rows.length === 0) {
            for (let x = 0; x < binTypes.length; x++) {
                let bins = await pool.query('INSERT INTO waste_bin (weight, filled_capacity, waste_donor_id, waste_type_id) VALUES ($1, $2, $3, $4) RETURNING weight, filled_capacity, waste_donor_id, waste_type_id, status, schedule, timestamp', [0, 0, donorId, binTypes[x].id]);
                isAdded = true;
            }
            if (!isAdded) {
                return { response: 'Waste bins were not created' };
            } else {
                return { response: 'Waste bins are now working' };
            }
        } else {
            return { response: 'Waste bins have been already allocated' }
        }
    };

    const getAllBinTypes = async () => {
        let res = await pool.query('select * from waste_type');
        return res.rows;
    };

    const getFullBinForDonor = async id => {
        let res = await pool.query('select waste_bin.id, waste_bin.weight, waste_bin.filled_capacity, waste_bin.status, waste_donor.firstname, waste_donor.lastname, waste_donor.residential_address, waste_type.name, waste_bin.waste_donor_id, waste_bin.waste_type_id from waste_bin inner join waste_donor on waste_donor.id = waste_bin.waste_donor_id inner join waste_type on waste_type.id = waste_bin.waste_type_id where filled_capacity>=80 and waste_donor_id = $1', [id]);
        return res.rows;
    };

    const binActivity = async request => {
        let data = [
            request.dateTime,
            request.donor,
            request.collector,
            request.wasteBins,
            request.status,
        ];
        await pool.query('insert into waste_bin_collection_activity (date_time, waste_donor_id, waste_collector_id, waste_type_id, status) values ($1, $2, $3, $4, $5)', data);
        await pool.query('update waste_bin set status = false where waste_donor_id = $1 and waste_type_id = $2', [request.donor, request.wasteBins]);
    };

    const getHistory = async id => {
        let res = await pool.query('select waste_bin_collection_activity.id, waste_bin_collection_activity.date_time, waste_bin_collection_activity.status, waste_bin_collection_activity.waste_donor_id, waste_donor.firstname, waste_donor.lastname, waste_type.name from waste_bin_collection_activity inner join waste_donor on waste_donor.id = waste_bin_collection_activity.waste_donor_id inner join waste_type on waste_type.id = waste_bin_collection_activity.waste_type_id where waste_collector_id = $1', [id]);
        return res.rows;
    };

    const getHistoryForDonor = async id => {
        let res = await pool.query('select waste_bin_collection_activity.id, waste_bin_collection_activity.date_time, waste_bin_collection_activity.status, waste_bin_collection_activity.waste_donor_id, waste_collector.first_name, waste_collector.last_name, waste_type.name from waste_bin_collection_activity inner join waste_collector on waste_collector.id = waste_bin_collection_activity.waste_collector_id inner join waste_type on waste_type.id = waste_bin_collection_activity.waste_type_id where waste_donor_id = $1 and status = false', [id]);
        return res.rows;
    };

    const setBinForCollection = async searchQuery => {
        let res = await pool.query('select * from waste_bin where waste_donor_id = $1 and waste_type_id = $2', [searchQuery.userId, searchQuery.binId]);
        
        if (res.rows.length !== 0) {
            res.rows.forEach(async bins => {
                console.log(bins.id);
                console.log(bins.status);
                if (!bins.status) {
                    await pool.query('insert into waste_bin (waste_donor_id, waste_type_id, status, timestamp) values ($1, $2, $3, $4)', [searchQuery.userId, searchQuery.binId, true, new Date()]);
                }else { 
                    console.log('Request has already bin sent');
                }               
            });
            return { response: true }
        } else {
            await pool.query('insert into waste_bin (waste_donor_id, waste_type_id, status, timestamp) values ($1, $2, $3, $4)', [searchQuery.userId, searchQuery.binId, true, new Date()]);
            // await pool.query('update waste_bin set status = $1, filled_capacity = 99 where waste_donor_id = $2 and id = $3', [true, searchQuery.userId, searchQuery.binId]);
            return { response: true }
        };
    };

    const getBinsReadyForCollection = async id => {
        let res = await pool.query('select waste_type.id, waste_bin.weight, waste_bin.filled_capacity, waste_bin.status, waste_donor.firstname, waste_type.name, waste_bin.waste_donor_id from waste_bin inner join waste_donor on waste_donor.id = waste_bin.waste_donor_id inner join waste_type on waste_type.id = waste_bin.waste_type_id where waste_donor_id = $1 and status = $2', [id, true])
        return res.rows;
    };

    const cancelRequest = async searchQuery => {
        let res = await pool.query('update waste_bin set status = $1 where waste_donor_id = $2 and id = $3', [false, searchQuery.donorId, searchQuery.binId]);
    };

    const getNotificationsForCollectionInProgressForCollector = async (id) => {
        let res = await pool.query('select waste_bin_collection_activity.id, waste_bin_collection_activity.date_time, waste_bin_collection_activity.status, waste_bin_collection_activity.waste_donor_id, waste_donor.firstname, waste_donor.lastname, waste_donor.residential_address, waste_donor.cell_number, waste_type.name from waste_bin_collection_activity inner join waste_donor on waste_donor.id = waste_bin_collection_activity.waste_donor_id inner join waste_type on waste_type.id = waste_bin_collection_activity.waste_type_id where waste_collector_id = $1 and status = true ', [id]);
        return res.rows;
    };

    const getNotificationsForCollectionInProgressForDonor = async id => {
        let res = await pool.query('select waste_bin_collection_activity.date_time, waste_bin_collection_activity.status, waste_bin_collection_activity.waste_donor_id, waste_bin_collection_activity.waste_collector_id, waste_donor.firstname, waste_donor.lastname, waste_type.name, waste_collector.first_name, waste_collector.last_name from waste_bin_collection_activity inner join waste_donor on waste_donor.id = waste_bin_collection_activity.waste_donor_id inner join waste_type on waste_type.id = waste_bin_collection_activity.waste_type_id inner join waste_collector on waste_collector.id = waste_bin_collection_activity.waste_collector_id where waste_donor_id = $1 and status = true', [id]);
        return res.rows;
    };

    const closePickUpRequest = async wcid => {
        console.log(wcid);
        let res = await pool.query('select * from waste_bin_collection_activity where status = true and waste_collector_id = $1', [wcid]);
        if (res.rows.length !== 0) {
            await pool.query('update waste_bin_collection_activity set status = false, date_time = $1 where waste_collector_id = $2 and status = true', [new Date(), wcid]);
            return { response: true }
        } else { 
            return { response: false }
        }
    }
    return {
        createBins,
        getAllBinTypes,
        getFullBinForDonor,
        binActivity,
        getHistory,
        getHistoryForDonor,
        setBinForCollection,
        getBinsReadyForCollection,
        cancelRequest,
        getNotificationsForCollectionInProgressForCollector,
        getNotificationsForCollectionInProgressForDonor,
        closePickUpRequest
    }
};