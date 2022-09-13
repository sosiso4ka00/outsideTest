CREATE TABLE "User" (
	uid uuid NOT NULL DEFAULT gen_random_uuid(),
	email varchar(100) NULL,
	"password" varchar(100) NULL,
	nickname varchar(30) NULL,
	CONSTRAINT user_pk PRIMARY KEY (uid)
);

CREATE TABLE "Tag" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	creator uuid NOT NULL,
	"name" varchar(40) NULL,
	sortorder int4 NULL DEFAULT 0,
	CONSTRAINT tag_pk PRIMARY KEY (id)
);

CREATE TABLE "UserTag" (
	userid uuid NOT NULL,
	tagid int4 NOT NULL,
	CONSTRAINT usertag_fk FOREIGN KEY (userid) REFERENCES "User"(uid) ON DELETE CASCADE,
	CONSTRAINT usertag_fk_1 FOREIGN KEY (tagid) REFERENCES "Tag"(id) ON DELETE CASCADE
);