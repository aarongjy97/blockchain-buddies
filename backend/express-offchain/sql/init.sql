drop table if exists supplier cascade ;
drop table if exists procurer cascade ;
drop table if exists ProcurerEmployee cascade ;
drop table if exists supplierEmployee cascade ;
drop table if exists courier cascade ;
drop table if exists courierEmployee cascade ;
drop table if exists product cascade ;
drop type if exists employeeType ;

create type employeeType as enum ('finance', 'logistics');

CREATE TABLE Supplier(
    id serial not null,
    address varchar (255) not null,
    ownerAddress varchar (255) not null,
    name varchar (100) not null,
    primary key (id)
);

create table SupplierEmployee(
    id serial not null,
    address varchar (255) not null,
    company int not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Supplier on update cascade
);

create table Procurer (
    id serial not null,
    address varchar (255) not null,
    ownerAddress varchar (255) not null,
    name varchar (100) not null,
    primary key (id)
);

create table ProcurerEmployee (
    id serial not null,
    address varchar (255) not null,
    employeeType employeeType not null,
    company int not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Procurer on update cascade
);

create table Courier (
    id serial not null,
    address varchar (255) not null,
    ownerAddress varchar (255) not null,
    name varchar (100) not null,
    primary key (id)
);

create table CourierEmployee (
    id serial not null,
    address varchar (255) not null,
    company int not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (id),
    foreign key (company) references Courier on update cascade
);

create table product (
    id integer not null,
    supplier int not null,
    productName varchar (255) not null,
    productImage bytea, 
    foreign key (supplier) references Supplier on update cascade,
    primary key (id)
);

begin;

insert into supplier (address, ownerAddress, name) values
('1', '1', 'Dell'),
('2', '2', 'Foxconn'),
('3', '3', 'TSMC');

insert into supplieremployee (address, company, name, email, password) values
('1', '1', 'John Snow', 'johnsnow@dell.com', 'password'),
('2', '2', 'Carl John', 'carljohn@foxc.com', 'password'),
('3', '3', 'Carl Snow', 'carlsnow@tsmc.com', 'password');

insert into procurer (address, ownerAddress, name) values 
('1', '1', 'AMD'),
('2', '2', 'Apple'),
('3', '3', 'Google');

insert into procureremployee (address, company, employeeType, name, email, password) values 
('1', '1', 'finance',   'Charlotte Wang', 'charwang@amd.com', 'password'),
('2', '1', 'logistics', 'Jia Xuan Toh',   'tohjiaxn@amd.com', 'password'),
('3', '2', 'finance',   'Vicki Yew',      'vickiyew@app.com', 'password'), 
('4', '2', 'logistics', 'Jian Bin Huang', 'jianbinh@app.com', 'password'), 
('5', '3', 'finance',   'Aaron Goh',      'aarongoh@gle.com', 'password'),
('6', '3', 'logistics', 'Arnold Ng',      'arnoldng@gle.com', 'password');

insert into courier (address, ownerAddress, name) values 
('1', '1', 'NinjaVan'),
('2', '2', 'DHL');

insert into courieremployee (address, company, name, email, password) values 
('1', '1', 'James Lim', 'jameslim@njv.com', 'password'),
('2', '2', 'Scott Koh', 'scottkoh@dhl.com', 'password');

commit;