import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bill from '@/models/bill';
import Inventory from '@/models/inventory';
import { convertUnits } from '@/store/store';

export async function GET() {
  try {
    await connectDB();
    const bills = await Bill.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Generate bill number
    const billCount = await Bill.countDocuments();
    const billNumber = `BILL-${(billCount + 1).toString().padStart(4, '0')}`;
    
    // Check stock availability for all items
    for (const item of data.items) {
      const inventoryItem = await Inventory.findById(item.id);
      if (!inventoryItem) {
        return NextResponse.json(
          { error: `Item ${item.name} not found in inventory` },
          { status: 400 }
        );
      }

      const requestedQuantityInBase = convertUnits(
        item.quantity,
        item.unit,
        inventoryItem.unit
      );

      if (!inventoryItem.stock || inventoryItem.stock < requestedQuantityInBase) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for ${item.name}. Available: ${inventoryItem.stock} ${inventoryItem.unit.value}, Requested: ${item.quantity} ${item.unit.value}` 
          },
          { status: 400 }
        );
      }
    }
    
    // Create bill
    const bill = await Bill.create({
      ...data,
      billNumber,
      date: new Date()
    });
    
    // Update inventory
    for (const item of data.items) {
      const inventoryItem = await Inventory.findById(item.id);
      if (inventoryItem) {
        const quantityToDeduct = convertUnits(
          item.quantity,
          item.unit,
          inventoryItem.unit
        );
        
        await Inventory.findByIdAndUpdate(
          item.id,
          { $inc: { stock: -quantityToDeduct } }
        );
      }
    }
    
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, ...updates } = data;
    
    const bill = await Bill.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bill' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const bill = await Bill.findByIdAndDelete(id);
    
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    );
  }
} 