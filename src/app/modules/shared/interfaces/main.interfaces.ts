export interface IAirtimeRecharge {
    phone: string,
    amount: number,
    serviceId: 'mtn' | 'glo' | 'airtel' | 'etisalat'
}

export interface IDataRecharge {
    phone: string;
    serviceID: 'mtn-data' | 'glo-data' | 'airtel-data' | 'etisalat-data';
    variation_code: string;
    amount ?: number;
    billersCode: string; // the phone number you wish to make the subscription on
}

export interface IDataVariation {
    variation_code: string, 
    name: string, 
    variation_amount: string, 
    fixedPrice: string
}

export interface ITVSubscriptionVariation extends IDataVariation {};
export interface ITVSubscription {
    serviceID: 'dstv' | 'gotv' | 'startimes';
    billersCode: string; // smartcard number
    variation_code: string;
    amount: number;
    phone: string; // phone number of the recipient 
}

export interface IElectricityPayment {
    billersCode: string; // metre number
    variation_code: 'prepaid' | 'postpaid'; // metre type
    amount: number;
    phone: string; // phone number of the recipient 
    serviceID: 'ikeja-electric' | 'eko-electric' | 'kano-electric' | 'portharcourt-electric' | 'jos-electric' | 'ibadan-electric' | 'kaduna-electric' | 'abuja-electric'
}

export interface IEducationPaymentVariation extends IDataVariation {};
export interface IEducationPayment {
    serviceID: 'waec' | 'waec-registration';
    variation_code: string;
    amount: number;
    phone: string; // phone number of the recipient 
}

// Feedback
export interface Feedback <T> {
    success : boolean;
    msg ?: string;
    data ?: T;
}

// Admin - a user with higher privilege
export interface IAdmin extends IUser {
    supremacy : AdminSupremacy
}

export enum AdminSupremacy {
    OVERALL = "overall", USERS = "users", USERS_DEPOSITS = "users-deposits", SERVICES_AND_USERS = "services-and-users", SERVICES = "services"
}

// Who is a user?
export interface IUser {
    _id ?: string;
    info: _UserInfo;
    credential: _UserLoginCredential;
    wallet: _UserWallet;
    transactions: _UserTransaction[];
}

export interface _UserInfo {
    fullname: string;
    email: string;
    phone: string;
}

export interface _UserLoginCredential {
    password: string;
}

export interface _UserWallet { 
    balance: number;
}

export class Transaction implements _UserTransaction {
    date: string = "";
    recipient: string = "";
    reference: string = "";
    service: Services = Services.AIRTIME;
    amount: number = 0;
    phone: string = "";
}

export interface _UserTransaction {
    date: string;
    service: Services
    recipient: string;
    reference: string;
    amount: number;
    phone: string;
}

// What services do you provide
export enum Services {
    DATA = "data", AIRTIME = "airtime", CABLE = "cable", ELECTRICITY = "electricity", EDUCATION = "education"
}


// dataway
export interface IDatawayServiceCategory {
    name: "Airtime" | "Data" | "TV" | "Power" | "Internet Services" | "Education" | "Auto Insurance" | "Betting";
    slug: "airtime" | "data" | "TV" | "power" | "internet-services" | "education" | "auto-insurance" | "betting";
    status: "active" | "inactive";
}


export interface IDatawayService {
    name: string,
    slug: string,
    variation_label: any,
    biller_identifier_name: string,
    status: "active"
}

export interface IDatawayServiceVariation {
    name: string;
    slug: string;
    amount: number;
    fixed_price: "yes" | "no";
    status: "active" | "inactive";
    new_amount: number;
}


export enum DatawayServiceCategorySlug {
    AIRTIME = "airtime",
    DATA = "data",
    TV = "TV",
    POWER = "power",
    INTERNET_SERVICES = "internet-services",
    EDUCATION = "education",
    AUTO_INSURANCE = "auto-insurance",
    BETTING = "betting"
}

export interface IDatawayFeedback {
    response_code: string;
    response_message: string;
    response_description: string;
    data: any
}

// only relevant to power and tv
export interface IDatawayBillerValidationPayload {
    serviceSlug: string, 
    billerIdentifier: string, // meter number or smart card number
    variationSlug: string // compulsory for power
}

export interface IDatawayPaymentPayload extends IDatawayBillerValidationPayload {
    // billerIdentifier includes phone numbers, meter numbers or smart card numbers
    amount: string,
    reference?: string,
}

export interface IDatawayPaymentSuccessFeedback {
    "external_reference": string,
    "reference": string,
    "status": "Successful",
    "amount": string | number,
    "date": string,
    "title": string,
    "commission": string | number,
    "extras": any[]
}

// nearlyfree
export enum NEARLYFREE_ENDPOINTS {
    SERVICE = "service",
    PLANS = "plans",
    PURCHASE = "purchase"
}

export enum NEARLYFREE_SERVICES {
    TV = "Tv", ELECTRICITY = "Electricity", DATA = "Data", AIRTIME = "AIRTIME", EXAMINATION = "EXAMINATION"
}

export interface INearlyFreeServiceNetwork {
    "service": string,
    "network": string,
    "networkId": string,
    "price": string,
    "minimum": string,
    "maximum": string
}

export interface INearlyFreePurchasePayload {
    referenceId: string;
    purchase : string;
    network: string; //networkId
    plan: string; //planId
    amount ?: number; // for airtime
    phoneNumber: string;
    iucNumber ?: string; // only for tv:smartCardNumber and electricity:MetreNumber
    quantity ?: number; // only for examination e-pins
}

export interface INearlyFreeServicePlan {
    plan: string,
    planId: string,
    price: string,
    minimum: string,
    maximum: string
}

export interface IMonnifyOnlinePayResponse { paymentRef: any; amountPaid: any; transactionRef: any; transactionHash: any; }
export interface ICEE {
    account : {
        commissionBal : number
    }
    settings: ICEESettings
}

export interface ICEESettings {
    commissionSetting: ICommissionSetting
}

export interface ICommissionSetting {
    datasubCharge : number;
    tvsubCharge : number;
}

export interface IMonnifyReservedAccount {
    "bankCode": string,
    "bankName": string,
    "accountNumber": string,
    "accountName": string
}

export interface INotification {
    _id ?: string;
    title ?: string;
    body : string;
    target : "dashboard" | "airtime" | "data" | "fund-wallet" | "tv" | "power" | "transaction" | "home"
}

export const notificationsViewStatus = {
    dashboard: false,
    airtime: false,
    data: false,
    fundWallet: false,
    tv: false,
    power: false,
    transaction: false,
    home: false
}