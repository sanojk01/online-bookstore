const userModel = require('../models/user.model');

// Get user's addresses
async function getUserAddress(req, res) {
    const id = req.user.id;

    const user = await userModel.findById(id).select('addresses');

    if (!user) {
        return res.status(404).json({ 
            message: 'User not found' 
        });
    }

    res.status(200).json({
        message: 'User address retrieved successfully',
        address: user.addresses || null
    });
}

// Add user's address
async function addUserAddress(req, res) {

    const id = req.user.id;
    const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
        return res.status(404).json({ 
            message: 'User not found' 
        });
    }

    if (isDefault) {
        await userModel.updateOne(
            { _id: id },
            { $set: { "addresses.$[].isDefault": false } }
        );
    }

    const updatedUser = await userModel.findByIdAndUpdate({_id: id}, {
        $push: {
            addresses: {
                name,
                phone,
                street,
                city,
                state,
                pincode,
                country,
                isDefault: isDefault || false
            }
        }
    }, { returnDocument: 'after' }).select('addresses'); 

    res.status(200).json({
        message: 'User address updated successfully',
        address: updatedUser.addresses || null
    });
}

// Delete user's address
async function deleteUserAddress(req, res) {
    const id = req.user.id;
    const { addressId } = req.params;

    const isAddressExists = await userModel.findOne({ _id: id, 'addresses._id': addressId });

    if (!isAddressExists) {
        return res.status(404).json({ 
            message: 'Address not found' 
        });
    }

    const user = await userModel.findByIdAndUpdate({_id: id}, {
        $pull: {
            addresses: {
                _id: addressId
            }
        }
    }, { returnDocument: 'after' }).select('addresses');

    if (!user) {
        return res.status(404).json({ 
            message: 'User not found' 
        });
    }

    const addressExists = user.addresses.some(address => address._id.toString() === addressId);

    if (addressExists) {
        return res.status(500).json({ 
            message: 'failed to delete address' 
        });
    }

    res.status(200).json({
        message: 'User address deleted successfully',
        address: user.addresses || null
    });
}

// Set user's address as default
async function setDefaultAddress(req, res) {
    const id = req.user.id;
    const { addressId } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
        return res.status(404).json({ 
            message: 'User not found' 
        });
    }

    if (!user.addresses.id(addressId)) {
        return res.status(404).json({ 
            message: 'Address not found' 
        });
    }

    // Set all addresses to not default
    await userModel.updateOne(
        { _id: id },
        { $set: { "addresses.$[].isDefault": false } }
    );

    // Set the specified address as default
    await userModel.updateOne(
        { _id: id, "addresses._id": addressId },
        { $set: { "addresses.$.isDefault": true } }
    );

    res.status(200).json({
        message: 'Default address updated successfully'
    });
}


module.exports = {
    getUserAddress,
    addUserAddress,
    deleteUserAddress,
    setDefaultAddress
};