import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
