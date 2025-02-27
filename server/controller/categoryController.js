const Category = require('../model/categoryModel')

const CategoryController = {
    getAll: async (req,res) => {
        try {
            let data = await Category.find({})
                res.status(200).json({ length: data.length, categories: data})
        } catch (err) {
            return  res.status(500).json({ msg: err.message })
        }
    },
    getSingle: async (req,res) => {
        try {
            let data = await Category.findById({ _id: req.params.id })

            res.status(200).json({ category: data})

        } catch (err) {
            return  res.status(500).json({ msg: err.message })
        }
    },
    create: async (req,res) => {
        try {
           const { id, name,marks,result } = req.body;
           
           let extCat = await Category.findOne({ name })
                if(extCat) 
                    return res.status(400).json({ msg: "Name already exists."})
            
            let data = await Category.create({  id, name,marks,result})

           res.json({ msg: "data created successfully", category: data })

        } catch (err) {
            return  res.status(500).json({ msg: err.message })
        }
    },
    update: async (req,res) => {
        try {
            const {  id, name,marks,result, isActive } = req.body
            
            let extCat = await Category.findById({ _id: req.params.id })
                if(!extCat)
                    return res.status(400).json({ msg: "data doesn't exists."})
                
              await Category.findByIdAndUpdate({ _id: req.params.id }, { id, name,marks,result, isActive })

                res.status(200).json({ msg: "data updated successfully"})

        } catch (err) {
            return  res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req,res) => {
        try {
             
            let extCat = await Category.findById({ _id: req.params.id })
                if(!extCat)
                    return res.status(400).json({ msg: "data doesn't exists."})
                
           await Category.findByIdAndDelete({ _id: req.params.id })
            return res.status(200).json({ msg: "data deleted successfully"})

        } catch (err) {
            return  res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = CategoryController