Alter Procedure [dbo].[pms_shard_pms_get_update]
AS
BEGIN
	declare @str nvarchar(max)='';
	set @str+='IF EXISTS (
        SELECT type_desc, type
        FROM sys.procedures WITH(NOLOCK)
        WHERE NAME = ''pms_shard_pms_get''
            AND type = ''P''
      )
     DROP PROCEDURE dbo.pms_shard_pms_get';
exec sp_executesql @str;
	set @str='
			CREATE Procedure pms_shard_pms_get(
 @userId1 int,
 @userId2 int,
 @fromInclusive datetime=null,
 @toExclusive datetime = null,
 @n int=1000
)
AS
BEGIN
	create table #tempPms(
	[userIdHighest] int, [userIdLowest] int, [content] text, [sentAt] datetime, [from] int, [clientAssignedUuid] uniqueidentifier
	);
	declare @userIdHighest int;
	declare @userIdLowest int;
	if(@userId1 > @userId2)
	begin
	set @userIdHighest  =   @userId1;
	set @userIdLowest  =@userId2;
	end 
	else
	begin
	set @userIdHighest  =   @userId2;
	set @userIdLowest  =@userId1;
	end
	if(@toExclusive is null) begin
	 set @toExclusive =getdate();
	end
	declare @insertedFromInclusive datetime;
	if(@fromInclusive is not null) begin
	 set @insertedFromInclusive =DATEADD(MINUTE,-3,@fromInclusive);
	end
	else
	begin
		set @insertedFromInclusive =null;
	end
	declare @insertedToExclusive datetime =@toExclusive;
	declare @nLeft int = @n;';
	declare @doSelect varchar(max) = '
	select (select [clientAssignedUuid] as /*<S_CLIENT_ASSIGNED_UUID>*/''clientAssignedUuid''/*<S_CLIENT_ASSIGNED_UUID>*/,
	[content] as /*<S_CONTENT>*/''content''/*<S_CONTENT>*/,
	[sentAt] as /*<S_SENT_AT>*/''sentAt''/*<S_SENT_AT>*/, 
	[from] as /*<S_FROM>*/''from''/*<S_FROM>*/ from #tempPms order by [sentAt] asc
			for JSON path
			)
			as pms;';
	
	set @str +=STUFF((
        select 
			(case when tblHorizontalPartitions.[to] is not null then
				
			' set @nLeft = @n - (select count(*) from #tempPms); if(@nLeft<=0)begin '+@doSelect+'
					return;
			end;
			if(@insertedToExclusive is null or @insertedToExclusive > CAST('''+convert(varchar(25), tblHorizontalPartitions.[from], 120)+'''as datetime)
			 and @insertedFromInclusive is null or @insertedFromInclusive <= CAST('''+
				convert(varchar(25), tblHorizontalPartitions.[to], 120)+'''as datetime))
				begin '+
					dbo.pms_shard_pms_tblPmsX_select_get(tblHorizontalPartitions.[tableName], '#tempPms')+
				' end
				if(@insertedFromInclusive is not null and @insertedFromInclusive >= CAST('''+convert(varchar(25), tblHorizontalPartitions.[to], 120)+'''as datetime))
				begin '+@doSelect+'
					return;
				end;'
			else
				'if(@insertedToExclusive is null or @insertedToExclusive > CAST('''+convert(varchar(25), tblHorizontalPartitions.[from], 120)+'''as datetime)
				)
				begin '+
					dbo.pms_shard_pms_tblPmsX_select_get(tblHorizontalPartitions.[tableName], '#tempPms')+
				' end '
			end) 
        from tblHorizontalPartitions order by tblHorizontalPartitions.[from] desc
        for xml path(''), type
    ).value('.', 'varchar(max)'), 1, 0, '') ;

	set @str+=@doSelect+' END;';
exec sp_executesql @str;
END
