DROP TABLE IF EXISTS users CASCADE ;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS messages CASCADE;


create table users(
	id serial primary key,
	uuid varchar(64) not null unique,
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	username varchar(255) not null unique,
	password varchar(255) not null,
	created_at timestamp,
	is_admin boolean	
);

create table rooms (
	id serial primary key,
	creator_id integer references users(id), 
	uuid varchar(64) not null unique,
	room_name varchar(255) not null unique,
	users integer[] not null,
	last_updated timestamp not null
);

create table messages(
	id serial primary key,
	content varchar(6969696969) not null unique,
	user_id integer references users(id),
	room_id integer references rooms(id),
	created_at timestamp not null 
)