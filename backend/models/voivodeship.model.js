import mongoose from "mongoose";

const voivodeshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stats2018: {
      totalAccidents: { type: Number, required: true },
      fatalities: { type: Number, required: true },
      injuries: { type: Number, required: true },
      seriousInjuries: { type: Number, required: true },
      minorInjuries: { type: Number, required: true }
    },
    stats2023: {
      totalAccidents: { type: Number, required: true },
      fatalities: { type: Number, required: true },
      injuries: { type: Number, required: true },
      seriousInjuries: { type: Number, required: true },
      minorInjuries: { type: Number, required: true }
    }
  });
  
  const Voivodeship = mongoose.model('Voivodeship', voivodeshipSchema);
  
  export default Voivodeship;