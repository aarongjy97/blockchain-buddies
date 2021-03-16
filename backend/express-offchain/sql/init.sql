CREATE TABLE Supplier(
    address varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (address, email)
);

create table Company (
    address varchar (255) not null,
    name varchar (100) not null,
    primary key (address)
);

create table FinanceEmployee (
    address varchar (255) not null,
    company varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (address, email),
    foreign key (company) references Company
);

create table LogisticsEmployee (
    address varchar (255) not null,
    company varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (address, email),
    foreign key (company) references Company
);

create table Courier (
    address varchar (255) not null,
    name varchar (100) not null,
    email varchar (100) not null,
    password varchar (100) not null,
    primary key (address, email)
);