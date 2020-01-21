Delimiter //

Create Procedure pms_shard_update()
BEGIN
	call pms_shard_horizontal_partitions_create;;
	call pms_shard_pms_get_update;;
	call pms_shard_pms_add_update;;
END;
//

DELIMITER ;


