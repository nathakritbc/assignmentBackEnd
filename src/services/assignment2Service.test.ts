import Assignment2Service from "../services/assignment2Service";
import dataDemo from "../mocks/dataDemo.json";

describe("Assignment2Service", () => {
  const items = dataDemo;
  const batchSize = 1000; // ขนาด batch สำหรับทดสอบฟังก์ชัน batch

  it("should calculate total revenue correctly using calculateTotalRevenueOld", () => {
    const result = Assignment2Service.calculateTotalRevenueOld(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenue1", async () => {
    const result = await Assignment2Service.calculateTotalRevenue1(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenue2", async () => {
    const result = await Assignment2Service.calculateTotalRevenue2(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenue3", async () => {
    const result = await Assignment2Service.calculateTotalRevenue3(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenue4", async () => {
    const result = await Assignment2Service.calculateTotalRevenue4(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenueBatch", async () => {
    const result = await Assignment2Service.calculateTotalRevenueBatch(
      items,
      batchSize
    );
    expect(result).toBeGreaterThan(0);
  });

  it("should calculate total revenue correctly using calculateTotalRevenueAsync", async () => {
    const result = await Assignment2Service.calculateTotalRevenueAsync(items);
    expect(result).toBeGreaterThan(0);
  });

  it("should throw error for invalid data in calculateTotalRevenueOld", () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    try {
      Assignment2Service.calculateTotalRevenueOld(invalidItems);
    } catch (error) {
      expect(error).toEqual(new Error("Invalid order item data."));
    }
  });

  it("should throw error for invalid data in calculateTotalRevenue1", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenue1(invalidItems)
    ).rejects.toThrow("Invalid order item data.");
  });

  it("should throw error for invalid data in calculateTotalRevenue2", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenue2(invalidItems)
    ).rejects.toThrow("Invalid or missing value detected in orderItems.");
  });

  it("should throw error for invalid data in calculateTotalRevenue3", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenue3(invalidItems)
    ).rejects.toThrow(
      'Invalid value detected in item: {"price":-10,"quantity":1}'
    );
  });

  it("should throw error for invalid data in calculateTotalRevenue4", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenue4(invalidItems)
    ).rejects.toThrow(
      'Invalid value detected in item: {"id":"invalid","price":-10,"quantity":1}'
    );
  });

  it("should throw error for invalid data in calculateTotalRevenueBatch", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenueBatch(invalidItems, batchSize)
    ).rejects.toThrow(
      'Invalid value detected in item: {"price":-10,"quantity":1}'
    );
  });

  it("should throw error for invalid data in calculateTotalRevenueAsync", async () => {
    const invalidItems = [...items, { id: "invalid", price: -10, quantity: 1 }];
    await expect(
      Assignment2Service.calculateTotalRevenueAsync(invalidItems)
    ).rejects.toThrow("Invalid value detected");
  });
});
