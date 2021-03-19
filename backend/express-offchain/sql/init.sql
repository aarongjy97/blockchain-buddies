drop table if exists supplier cascade ;
drop table if exists procurer cascade ;
drop table if exists ProcurerEmployee cascade ;
drop table if exists supplierEmployee cascade ;
drop table if exists courier cascade ;
drop table if exists courierEmployee cascade ;
drop table if exists product cascade ;
drop type if exists employeeType ;
drop type if exists orderStatus ;

create type employeeType as enum ('finance', 'logistics');
create type orderStatus as enum ('ordered', 'internalapproved', 'internalrejected', 'supplierapproved', 'supplierrejected', 'delivering', 'delivered');

CREATE TABLE Supplier(
    address varchar (255) not null,
    name varchar (100) not null,
    primary key (address)
);

create table SupplierEmployee(
    id serial not null,
    address varchar (255) not null,
    company varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Supplier on update cascade
);

create table Procurer (
    address varchar (255) not null,
    name varchar (100) not null,
    primary key (address)
);

create table ProcurerEmployee (
    id serial not null,
    address varchar (255) not null,
    employeeType employeeType not null,
    company varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Procurer on update cascade
);

create table Courier (
    address varchar (255) not null,
    name varchar (100) not null,
    primary key (address)
);

create table CourierEmployee (
    id serial not null,
    address varchar (255) not null,
    company varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Courier on update cascade
);

create table product (
    id integer not null,
    supplier varchar (255) not null,
    productName varchar (255) not null,
    productImage bytea, 
    foreign key (supplier) references Supplier on update cascade,
    primary key (id)
);

begin;

insert into supplier (address, name) values
('1', 'Dell'),
('2', 'Foxconn'),
('3', 'TSMC');

insert into supplieremployee (address, company, name, email, password) values
('1', '1', 'John Snow', 'johnsnow@dell.com', 'password'),
('2', '2', 'Carl John', 'carljohn@foxc.com', 'password'),
('3', '3', 'Carl Snow', 'carlsnow@tsmc.com', 'password');

insert into procurer (address, name) values 
('1', 'AMD'),
('2', 'Apple'),
('3', 'Google');

insert into procureremployee (address, company, employeeType, name, email, password) values 
('1', '1', 'finance',   'Charlotte Wang', 'charwang@amd.com', 'password'),
('2', '1', 'logistics', 'Jia Xuan Toh',   'tohjiaxn@amd.com', 'password'),
('3', '2', 'finance',   'Vicki Yew',      'vickiyew@app.com', 'password'), 
('4', '2', 'logistics', 'Jian Bin Huang', 'jianbinh@app.com', 'password'), 
('5', '3', 'finance',   'Aaron Goh',      'aarongoh@gle.com', 'password'),
('6', '3', 'logistics', 'Arnold Ng',      'arnoldng@gle.com', 'password');

insert into courier (address, name) values 
('1', 'NinjaVan'),
('2', 'DHL');

insert into courieremployee (address, company, name, email, password) values 
('1', '1', 'James Lim', 'jameslim@njv.com', 'password'),
('2', '2', 'Scott Koh', 'scottkoh@dhl.com', 'password');

commit;