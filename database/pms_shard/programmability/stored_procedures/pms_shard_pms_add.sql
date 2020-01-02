
Alter Procedure pms_shard_pms_add(
@pms Pms readonly
)
AS
BEGIN
	declare @now datetime = GETDATE();
	insert into tblPms_09042020_134923([userIdHighest], [userIdLowest], [sentAt], [insertedAt], [from], [content]) 
	select 
	(case when userIdFrom < userIdTo then userIdTo else userIdFrom end), 
	(case when userIdFrom > userIdTo then userIdTo else userIdFrom end),
	pms.[sentAt],
	@now, 
	userIdFrom,
	pms.[content]
	from @pms pms;
END