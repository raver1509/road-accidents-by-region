import mongoose from "mongoose";

const voivodeshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stats2018: {
      totalAccidents: Number,
      fatalities: Number,
      injuries: Number,
      collisions: Number,
  },
  stats2023: {
      totalAccidents: Number,
      fatalities: Number,
      injuries: Number,
      collisions: Number,
  }
});

  
  const Voivodeship = mongoose.model('Voivodeship', voivodeshipSchema);
  
  export default Voivodeship;