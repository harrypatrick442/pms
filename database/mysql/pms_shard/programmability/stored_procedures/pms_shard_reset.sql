Delimiter //

Create Procedure pms_shard_reset()
BEGIN
create temporary table #tempPmsTablesToDelete(
	`tableName` varchar(100)
);
declare v_id int;
declare v_tableName varchar(100);

while(1=1)
do
	if((select count(*) from tblHorizontalPartitions)<1) thenbreak
	end if;;
	select top(1) `id`, `tableName` into v_id, v_tableName from tblHorizontalPartitions;
	declare v_strDeleteTable  longtext default Concat('drop table ',v_tableName,';');
	select v_strDeleteTable;
	call sp_executesql v_strDeleteTable;
	delete from tblHorizontalPartitions where `id`=v_id;
END WHILE;
end;
//

DELIMITER ;


