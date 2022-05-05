var StandModel = require('../models/standModel.js');


module.exports = {
    list: function (req, res) {
        StandModel.find(function (err, stands) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting stands.',
                    error: err
                });
            }

            return res.json({success: ture, "Stands": stands});
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        StandModel.findOne({_id: id}, function (err, stand) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting stand.',
                    error: err
                });
            }

            if (!stand) {
                return res.status(404).json({
                    success: false,
                    message: 'No such stand'
                });
            }

            return res.json({success: true, "Stand": stand});
        });
    },

    near: function(req, res){
        //console.log(req.query.longitude)
        //console.log(req.query.latitude)
        if(!req.query.longitude || !req.query.latitude){
            return res.status(500).json({
                success: false,
                message: "longitude or latitude not set",
            });
        }
        StandModel.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
                },
                distanceField: 'distance',
                spherical: true
            }
        }])
        .then(function(Stand, error){
            if(error){
                return res.status(500).json({
                    success: false,
                    message: "Error when getting Stand",
                    error: err
                });
            }
            return res.json({success:true, "Stand": Stand});
        })
    },

    create: function (req, res) {
        var objGeometry = {
            type: 'Point', 
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        }
        var stand = new StandModel({
			name : req.body.name,
			parkSpots : req.body.parkSpots,
            geometry: objGeometry
        });

        stand.save(function (err, stand) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when creating stand',
                    error: err
                });
            }

            return res.status(201).json({success: true, "Stand": stand});
        });
    },

    removeAll: function (req, res) {
        StandModel.remove({}, function (err, stand) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when deleting stand.',
                    error: err
                });
            }

            return res.status(204).json({success: true});
        });
    }

    /*
    update: function (req, res) {
        var id = req.params.id;

        StandModel.findOne({_id: id}, function (err, stand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting stand',
                    error: err
                });
            }

            if (!stand) {
                return res.status(404).json({
                    message: 'No such stand'
                });
            }

            stand.name = req.body.name ? req.body.name : stand.name;
			stand.parkSpots = req.body.parkSpots ? req.body.parkSpots : stand.parkSpots;
			
            stand.save(function (err, stand) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating stand.',
                        error: err
                    });
                }

                return res.json(stand);
            });
        });
    },
    */
};
