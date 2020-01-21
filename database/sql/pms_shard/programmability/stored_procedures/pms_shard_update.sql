Alter Procedure [dbo].[pms_shard_update]
AS
BEGIN
	exec pms_shard_horizontal_partitions_create;
	exec pms_shard_pms_get_update;
	exec pms_shard_pms_add_update;
END
