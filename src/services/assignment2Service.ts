import dataDemo from "../mocks/dataDemo.json";
import numeral from "numeral";

// ประเภทของ OrderItem
type OrderItem = {
  id: string;
  price: number;
  quantity: number;
};

type OrderItem2 = {
  id: string;
  price?: number; // price อาจจะมีหรือไม่มีก็ได้
  quantity: number;
};

// ข้อมูลตัวอย่าง
const items: OrderItem[] = dataDemo;
const batchSize = 1000; // ขนาด batch สำหรับทดสอบฟังก์ชัน batch

// ฟังก์ชันเดิมที่ยังไม่ได้ปรับปรุง
const calculateTotalRevenueOld = (orders: OrderItem[]): number => {
  let revenue = 0;
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < orders[i].quantity; j++) {
      revenue += Number(orders[i].price);
    }
  }
  return revenue;
};

// ตัวอย่างที่ 1: ปรับปรุงพื้นฐาน
const calculateTotalRevenue1 = async (
  orderItems: OrderItem[]
): Promise<number> => {
  // ตรวจสอบค่าที่ไม่ถูกต้องใน orderItems
  if (!orderItems.every(({ price, quantity }) => price >= 0 && quantity >= 0)) {
    throw new Error("Invalid order item data.");
  }
  // ใช้ reduce เพื่อคำนวณยอดรวมของ revenue
  return orderItems.reduce(
    (total, { price, quantity }) => total + price * quantity,
    0
  );
};

// ตัวอย่างที่ 2: รองรับข้อมูลที่ไม่สมบูรณ์
const calculateTotalRevenue2 = async (
  orderItems: OrderItem2[]
): Promise<number> => {
  // ตรวจสอบค่าที่ไม่ถูกต้องและข้อมูลที่ขาดหายไปใน orderItems
  if (
    !orderItems.every(
      ({ price, quantity }) =>
        price != null && quantity != null && price >= 0 && quantity >= 0
    )
  ) {
    throw new Error("Invalid or missing value detected in orderItems.");
  }
  // ใช้ reduce เพื่อคำนวณยอดรวมของ revenue โดยตรวจสอบค่าที่ขาดหายไป
  return orderItems.reduce(
    (total, { price, quantity }) => total + price! * quantity,
    0
  );
};

// ตัวอย่างที่ 3: ปรับปรุงประสิทธิภาพสำหรับข้อมูลจำนวนมาก
const calculateTotalRevenue3 = async (
  orderItems: OrderItem[]
): Promise<number> => {
  let total = 0;
  // ใช้ forEach เพื่อวนลูปผ่าน orderItems
  orderItems.forEach(({ price, quantity }) => {
    // ตรวจสอบค่าที่ไม่ถูกต้องและข้อมูลที่ขาดหายไป
    if (price == null || quantity == null || price < 0 || quantity < 0) {
      throw new Error(
        `Invalid value detected in item: ${JSON.stringify({ price, quantity })}`
      );
    }
    // คำนวณยอดรวมของ revenue
    total += price * quantity;
  });
  return total;
};

// ตัวอย่างที่ 4: ปรับปรุงประสิทธิภาพใช้ for เเทน forEach เพื่อลด overhead
const calculateTotalRevenue4 = async (
  orderItems: OrderItem[]
): Promise<number> => {
  let total = 0;
  let i = 0;
  for (i = 0; i < orderItems.length; i++) {
    const { price, quantity } = orderItems[i];
    if (price == null || quantity == null || price < 0 || quantity < 0) {
      throw new Error(
        `Invalid value detected in item: ${JSON.stringify(orderItems[i])}`
      );
    }
    total += price * quantity;
  }
  return total;
};

// ตัวอย่างที่ 5: ปรับปรุงประสิทธิภาพ รองรับข้อมูลขนาดใหญ่ ในกรณีที่ข้อมูลเกิน 10 ล้านรายการ ใช้ batch
const calculateTotalRevenueBatch = async (
  orderItems: OrderItem[],
  batchSize: number
): Promise<number> => {
  let total = 0;
  let i = 0;
  for (i = 0; i < orderItems.length; i += batchSize) {
    const batch = orderItems.slice(i, i + batchSize);
    batch.forEach(({ price, quantity }) => {
      if (price == null || quantity == null || price < 0 || quantity < 0) {
        throw new Error(
          `Invalid value detected in item: ${JSON.stringify({
            price,
            quantity,
          })}`
        );
      }
    });
    total += batch.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
      0
    );
  }
  return total;
};

// ตัวอย่างที่ 6: ปรับปรุงประสิทธิภาพ  รองรับ Async Processing (ถ้าจำเป็น)
const calculateTotalRevenueAsync = async (
  orderItems: OrderItem[]
): Promise<number> => {
  const results = await Promise.all(
    orderItems.map(async ({ price, quantity }) => {
      if (price == null || quantity == null || price < 0 || quantity < 0) {
        throw new Error(`Invalid value detected`);
      }
      return price * quantity;
    })
  );
  return results.reduce((sum, value) => sum + value, 0);
};

// ฟังก์ชัน debug สำหรับการทดสอบการคำนวณ
const debugTest = async () => {
  try {
    // คำนวณรายได้รวมจากฟังก์ชันทั้งสาม
    const [
      totalRevenueOld,
      totalRevenue1,
      totalRevenue2,
      totalRevenue3,
      totalRevenue4,
      totalRevenueBatch,
      totalRevenueAsync,
    ] = await Promise.all([
      calculateTotalRevenueOld(items),
      calculateTotalRevenue1(items),
      calculateTotalRevenue2(items),
      calculateTotalRevenue3(items),
      calculateTotalRevenue4(items),
      calculateTotalRevenueBatch(items, batchSize),
      calculateTotalRevenueAsync(items),
    ]);

    console.log(
      "Total Revenue ฟังก์ชันเดิมที่ยังไม่ปรับปรุง :",
      numeral(totalRevenueOld).format("0,0.00")
    );

    console.log(
      "Total Revenue ตัวอย่างที่ 1:",
      numeral(totalRevenue1).format("0,0.00")
    );
    console.log(
      "Total Revenue ตัวอย่างที่ 2:",
      numeral(totalRevenue2).format("0,0.00")
    );
    console.log(
      "Total Revenue ตัวอย่างที่ 3:",
      numeral(totalRevenue3).format("0,0.00")
    );

    console.log(
      "Total Revenue ตัวอย่างที่ 4:",
      numeral(totalRevenue3).format("0,0.00")
    );

    console.log(
      "Total Revenue batch :",
      numeral(totalRevenueBatch).format("0,0.00")
    );

    console.log(
      "Total Revenue async:",
      numeral(totalRevenueAsync).format("0,0.00")
    );

    const payload = {
      totalRevenueOld: {
        message: "Total Revenue ฟังก์ชันเดิมที่ยังไม่ปรับปรุง:",
        value: numeral(totalRevenueOld).format("0,0.00"),
        _value: Number(totalRevenueOld),
      },
      totalRevenue1: {
        message: "Total Revenue ตัวอย่างที่ 1:",
        value: numeral(totalRevenue1).format("0,0.00"),
        _value: Number(totalRevenue1),
      },
      totalRevenue2: {
        message: "Total Revenue ตัวอย่างที่ 2:",
        value: numeral(totalRevenue2).format("0,0.00"),
        _value: Number(totalRevenue2),
      },
      totalRevenue3: {
        message: "Total Revenue ตัวอย่างที่ 3:",
        value: numeral(totalRevenue3).format("0,0.00"),
        _value: Number(totalRevenue3),
      },
      totalRevenue4: {
        message: "Total Revenue ตัวอย่างที่ 4:",
        value: numeral(totalRevenue4).format("0,0.00"),
        _value: Number(totalRevenue4),
      },
      totalRevenueBatch: {
        message: "Total Revenue batch:",
        value: numeral(totalRevenueBatch).format("0,0.00"),
        _value: Number(totalRevenueBatch),
      },
      totalRevenueAsync: {
        message: "Total Revenue async:",
        value: numeral(totalRevenueAsync).format("0,0.00"),
        _value: Number(totalRevenueAsync),
      },
    };

    console.log("payload", payload);

    return payload;
  } catch (error: any) {
    console.error("Calculation failed:", error.message);
    console.error(error);
    throw error;
  }
};

// เรียกใช้ฟังก์ชัน debug
// debugTest();

const Assignment2Service = {
  calculateTotalRevenueOld,
  calculateTotalRevenue1,
  calculateTotalRevenue2,
  calculateTotalRevenue3,
  calculateTotalRevenue4,
  calculateTotalRevenueBatch,
  calculateTotalRevenueAsync,
  debugTest,
};
export default Assignment2Service;
