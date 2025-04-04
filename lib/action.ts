"use server"

interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    account_number: string
    account_name: string
    bank_id: number
  }
}

interface PaystackBank {
  id: number
  name: string
  slug: string
  code: string
  longcode: string
  gateway: string
  active: boolean
  country: string
  currency: string
  type: string
}

interface PaystackBanksResponse {
  status: boolean
  message: string
  data: PaystackBank[]
}

export async function verifyBankAccount(accountNumber: string, bankCode: string): Promise<PaystackResponse> {
  try {
    // Replace with your actual Paystack secret key
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    /* if (!PAYSTACK_SECRET_KEY) {
      throw new Error("Paystack API key is not configured")
    } */

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        status: false,
        message: data.message || "Failed to verify account",
      }
    }

    return data
  } catch (error) {
    console.error("Error verifying bank account:", error)
    return {
      status: false,
      message: "An error occurred while verifying the account",
    }
  }
}

export async function getBanks(): Promise<PaystackBank[]> {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    const response = await fetch("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // Uncomment this line
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data: PaystackBanksResponse = await response.json()

    if (!response.ok || !data.status) {
      console.error("Failed to fetch banks:", data.message)
      return []
    }

    // Return only active banks
    return data.data.filter((bank) => bank.active)
  } catch (error) {
    console.error("Error fetching banks:", error)
    return []
  }
}

