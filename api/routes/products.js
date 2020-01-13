const express = require('express');
const router = express.Router();


// Handel Requests for Products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET Request to / Products'

    });

});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST Request to / Products'

    });

});

router.get('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    if (id === '0B-C3-6C') {
        res.status(200).json({
            message: 'You Found 0B-C3-6C ID, YAY!',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an incorrect ID',
            id: id
        
        });
    } 
});

module.exports = router;