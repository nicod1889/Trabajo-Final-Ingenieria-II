// CLIENTE
export interface ClienteRequest{
    categoria: DocumentType;
    numeroIdentificacion: number;
    email: string;
    businessName?: string;
}

export interface ClienteResponse{
    id: number;
    categoria: DocumentType;
    numeroIdentificacion: number;
    email: string;
    businessName?: string;
    deleted?: boolean;
    //TODO agregar servicios vinculados, cuando esten disponibles
}

export enum DocumentType {
    DNI = 'DNI',
    CUIT = 'CUIT'
}

//VEHICLE
export interface VehicleRequest{
    plate: string;
    marcaId: number;
    model: string;
    mileage: number;
    observations: string;
}

export interface VehicleResponse{
    id: number;
    plate: string;
    model: string;
    mileage: number;
    observations: string;
    deleted: boolean;
    marca: MarcaResponse;
}

//CAMION
export interface CamionRequest{
    patente: string;
    marcaId: number;
    modelo: string;
    km: number;
    anio: number;
    numeroChasis: string;
    numeroMotor: string;
    observaciones: string;
}

export interface CamionResponse{
    id: number;
    patente: string;
    marca: MarcaResponse;
    modelo: string;
    km: number;
    anio: number;
    numeroChasis: string;
    numeroMotor: string;
    observaciones: string;
    deleted: boolean;
}

//MARCA
export interface MarcaRequest{
    nombre: string;
}

export interface MarcaResponse{
    id: number;
    nombre: string;
    deleted: boolean;
}

//CIUDAD
export interface CiudadRequest{
    nombre: string;
    provinciaId: number;
}

export interface CiudadResponse{
    id: number;
    nombre: string;
    provincia: Provincia;
    showedProvincia: string;
    deleted: boolean;
}

// VIAJE
export interface ViajeRequest{
    clientId: number;
    camionId: number;
    fechaSalida: Date;
    fechaEstimadaEntrega: Date;
    estado: StatusService;
    precio: number;
    fechaPago: Date;
}

export interface ViajeResponse{
    id: number;
    estado: StatusService;
    fechaPago: Date;
    precio: number;
    fechaSalida: string;
    fechaEstimadaEntrega: string;
    camion: CamionBasicResponse;
    cliente: ClienteBasicResponse;
    empleado: EmpleadoBasicResponse;
    camionCompound: string;
    empleadoCompound: string;
    showedEstado: string;
    nombreCliente: string;
    fechaSalidaEs: string;
    fechaEstimadaEntregaEs?: string;
    precioCurrency: string;
}

//SERVICES
export interface ServiceRequest{
    ClientId: number;
    vehicleId: number;
    sparePartsIds: number[];
    employeesIds: number[];
    serviceTypeId: number;
    startDate: Date;
    finalDate: Date;
    status: StatusService;
    price: number;
    payDate: Date;
}

export enum StatusService{
    TO_DO = 'TO_DO', 
    IN_PROGRESS = 'IN_PROGRESS', 
    FINISHED = 'FINISHED', 
    CANCELLED = 'CANCELLED'
}

export interface ServiceResponse{
    id: number;
    serviceType: ServiceTypeResponse;
    status: StatusService;
    payDate: Date;
    price: number;
    startDate: string;
    finalDate: string;
    vehicle: VehicleBasicResponse;
    Client: ClienteBasicResponse;
    employees: EmpleadoBasicResponse[];
    spareParts: SparePartResponse[];
    vehicleCompound: string;
    sparePartsCompound: string;
    employeesCompound: string;
    showedStatus: string;
    ClientName: string;
    startDateEs: string;
    finalDateEs?: string;
    priceCurrency?: string;
}

// SERVICETYPE
export interface ServiceTypeRequest{
    name: string;
    description: string;
}

export interface ServiceTypeResponse{
    id: number;
    name: string;
    description: string;
    isDeleted: boolean;
}

// TIPOCARGA
export interface TipoCargaRequest{
    nombre: string;
}

export interface TipoCargaResponse{
    id: number;
    nombre: string;
    isDeleted: boolean;
}

// CARGA
export interface CargaRequest{
    nombre: string;
    tipoCargaId: number;
}

export interface CargaResponse{
    id: number;
    nombre: string;
    tipoCarga: TipoCargaResponse;
    deleted: boolean;
}

// BASICS
export interface VehicleBasicResponse{
    id: number;
    plate: string;
    model: string;
    mileage: number;
    observations: string;
    marca: string;
}

export interface CamionBasicResponse{
    id: number;
    patente: string;
    modelo: string;
    km: number;
    anio: number;
    numeroChasis: string;
    numeroMotor: string;
    observaciones: string;
    marca: string;
}

export interface CargaBasicResponse{
    id: number;
    nombre: string;
    tipoCarga: string;
}

export interface ClienteBasicResponse{
    id: number;
    categoria: DocumentType;
    numeroIdentificacion: number;
    email: string;
    businessName?: string;
    deleted?: boolean;
}

// SPAREPART
export interface SparePartRequest {
    name: string;
    marcaId: number;
    madeIn: string;
}

export interface SparePartResponse {
    id: number;
    name: string;
    marca: MarcaResponse;
    madeIn: string;
    isDeleted: boolean;
}

// EMPLOYEE
export interface EmpleadoBasicResponse {
    id: number;
    nombre: string;
    apellido: string;
    deleted?: boolean;
}

export interface EmpleadoResponse {
    id:                     number;
    nombre:                 string;
    apellido:               string;
    services:               ServiceBasic[];
    email:                  string;
    numeroIdentificacion:   number;
    rol:                    Role;
    rolText:                string;
    direccion:              Direccion;
    deleted?:               boolean;
    direccionCompound:      string;
}

export interface EmpleadoRequest {
    nombre:                 string;
    apellido:               string;
    email:                  string;
    numeroIdentificacion:   number;
    rol:                    Role;
    direccion:              Direccion;
    password:               string;
}

// DIRECCION
export interface Direccion {
    street:     string;
    number:     number;
    floor?:      number;
    department?: string;
}

// SERVICE
export interface ServiceBasic {
    id:          number;
    serviceType: string;
    status:      string;
    price:       number;
    startDate:   Date;
    vehicle:     VehicleBasicResponse;
    payDate?:    Date;
    finalDate?:  Date;
}

export enum Role {
    ROL_ADMINISTRATIVO = 'Administrativo',
    ROL_CAMIONERO = 'Camionero',
    ROL_ADMIN = 'Admin'
}

export enum Provincia {
    BUENOS_AIRES = 'BUENOS_AIRES',
    CABA = 'CABA',
    CATAMARCA = 'CATAMARCA',
    CHACO = 'CHACO',
    CHUBUT = 'CHUBUT',
    CORDOBA = 'CORDOBA',
    CORRIENTES = 'CORRIENTES',
    ENTRE_RIOS = 'ENTRE_RIOS',
    FORMOSA = 'FORMOSA',
    JUJUY = 'JUJUY',
    LA_PAMPA = 'LA_PAMPA',
    LA_RIOJA = 'LA_RIOJA',
    MENDOZA = 'MENDOZA',
    MISIONES = 'MISIONES',
    NEUQUEN = 'NEUQUEN',
    RIO_NEGRO = 'RIO_NEGRO',
    SALTA = 'SALTA',
    SAN_JUAN = 'SAN_JUAN',
    SAN_LUIS = 'SAN_LUIS',
    SANTA_CRUZ = 'SANTA_CRUZ',
    SANTA_FE = 'SANTA_FE',
    SANTIAGO_DEL_ESTERO = 'SANTIAGO_DEL_ESTERO',
    TIERRA_DEL_FUEGO = 'TIERRA_DEL_FUEGO',
    TUCUMAN = 'TUCUMAN'
  }

type RoleKey = "ROL_ADMINISTRATIVO" | "ROL_CAMIONERO" | "ROL_ADMIN"

export interface employeeLogin {
    email:string,
    password:string
}