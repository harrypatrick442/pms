Delimiter //

Create Procedure pms_shard_add(
p_hostId int,
p_name varchar(128), 
p_userIdFromInclusive int,
p_userIdToExclusive int
)
sp_lbl:

BEGIN 
	insert into tblShards (hostId, created, name, userIdFromInclusive, userIdToExclusive) values(p_hostId, NOW(), p_name, p_userIdFromInclusive, p_userIdToExclusive);
	leave sp_lbl SCOPE_IDENTITY;
END;
//

DELIMITER ;


