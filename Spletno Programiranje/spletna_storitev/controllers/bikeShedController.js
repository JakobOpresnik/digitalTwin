var BikeshedModel = require('../models/bikeShedModel.js');

module.exports = {

    list: function (req, res) {
        BikeshedModel.find(function (err, bikeSheds) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting bikeShed.',
                    error: err
                });
            }

            return res.json({success: true, "BikeSheds": bikeSheds});
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        BikeshedModel.findOne({_id: id}, function (err, bikeShed) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting bikeShed.',
                    error: err
                });
            }

            if (!bikeShed) {
                return res.status(404).json({
                    success: false,
                    message: 'No such bikeShed'
                });
            }

            return res.status(201).json({success: true, "BikeShed": bikeShed});
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
        BikeshedModel.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
                },
                distanceField: 'distance',
                spherical: true
            }
        }])
        .then(function(BikeShed, error){
            if(error){
                return res.status(500).json({
                    success: false,
                    message: "Error when getting BikeShed",
                    error: err
                });
            }
            return res.json({success:true, "BikeShed": BikeShed});
        })
    },

    create: function (req, res) {
        var objGeometry = {
            type: 'Point', 
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        }
        var bikeShed = new BikeshedModel({
			providerName : req.body.providerName,
			providerLink : req.body.providerLink,
			address : req.body.address,
			quantity : req.body.quantity,
            geometry : objGeometry
        });

        bikeShed.save(function (err, bikeShed) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when creating bikeShed',
                    error: err
                });
            }

            return res.status(201).json({success: true, "BikeShed": bikeShed});
        });
    },

    removeAll: function (req, res) {
        BikeshedModel.remove({}, function (err, bikeShed) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when deleting bikeShed.',
                    error: err
                });
            }

            return res.status(204).json({success: true});
        });
    }

    /*
        update: function (req, res) {
        var id = req.params.id;

        BikeshedModel.findOne({_id: id}, function (err, bikeShed) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting bikeShed',
                    error: err
                });
            }

            if (!bikeShed) {
                return res.status(404).json({
                    message: 'No such bikeShed'
                });
            }

            bikeShed.providerName = req.body.providerName ? req.body.providerName : bikeShed.providerName;
			bikeShed.providerLink = req.body.providerLink ? req.body.providerLink : bikeShed.providerLink;
			bikeShed.address = req.body.address ? req.body.address : bikeShed.address;
			bikeShed.quantity = req.body.quantity ? req.body.quantity : bikeShed.quantity;
			
            bikeShed.save(function (err, bikeShed) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating bikeShed.',
                        error: err
                    });
                }

                return res.json(bikeShed);
            });
        });
    },
    */
};
