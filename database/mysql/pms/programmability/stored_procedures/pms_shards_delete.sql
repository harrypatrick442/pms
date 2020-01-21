Delimiter //

Create Procedure pms_shards_delete(
	p_ids varchar(2000)
)
BEGIN 
		delete t from tblShards t
		where t.id; in (select item from split_string_to_numbers(p_ids, ','))
END;
//

DELIMITER ;


