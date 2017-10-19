using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace DGCorp.BussinessLogic.Configuration.Components.Common
{
    public interface IWebConfiguration
    {
        int Port { get; }
    }

    public class WebConfiguration : IWebConfiguration
    {
        public WebConfiguration()
        {
            //JsonConvert.DeserializeObject<>()
        }

        public int Port { get; private set; }

        public void InitModuleConfiguration()
        {
            throw new NotImplementedException();
        }
    }
}
